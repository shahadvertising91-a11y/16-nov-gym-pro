package com.forge.bar

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ServiceInfo
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.widget.RemoteViews
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import java.util.ArrayDeque
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import java.util.Calendar
import java.util.Locale

/**
 * Foreground service (type "health") that owns the hardware step counter and keeps an
 * ongoing notification with a real progress bar:   "6,789 steps"  [=======>   ]  "229 kcal · goal 8,000"
 * Must be started while the app is in the foreground, after ACTIVITY_RECOGNITION has been granted.
 */
class StepService : Service(), SensorEventListener {

    companion object {
        const val CHANNEL = "forge_bar_v2"        // v2: default importance (shown in the main section, silent)
        const val OLD_CHANNEL = "forge_bar"
        const val NOTIF_ID = 4101
        const val ACTION_STOP = "com.forge.bar.STOP"
        const val EXTRA_GOAL = "goal"
        const val EXTRA_KPS = "kps"
        const val EXTRA_STRIDE = "stride"
        @Volatile var instance: StepService? = null
    }

    private lateinit var store: StepStore
    private lateinit var sm: SensorManager
    private var sensor: Sensor? = null          // TYPE_STEP_COUNTER: accurate, cumulative
    private var detector: Sensor? = null        // TYPE_STEP_DETECTOR: one event per step, instant
    private var steps = 0L
    private var counterSteps = 0L
    private val pendingTs = ArrayDeque<Long>()  // detector steps the counter has not reported yet
    private var lastNotif = 0L
    private var refreshQueued = false
    private val handler = Handler(Looper.getMainLooper())
    private val midnight = Runnable { onNewDay() }

    private val dateReceiver = object : BroadcastReceiver() {
        override fun onReceive(c: Context?, i: Intent?) { onNewDay() }   // DATE_CHANGED / TIME_SET / TIMEZONE_CHANGED
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        store = StepStore(this)
        sm = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        sensor = sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
        detector = sm.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)
        createChannel()
        val f = IntentFilter().apply {
            addAction(Intent.ACTION_DATE_CHANGED); addAction(Intent.ACTION_TIME_CHANGED); addAction(Intent.ACTION_TIMEZONE_CHANGED)
        }
        ContextCompat.registerReceiver(this, dateReceiver, f, ContextCompat.RECEIVER_NOT_EXPORTED)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) { stopFromApp(); return START_NOT_STICKY }
        intent?.let {
            if (it.hasExtra(EXTRA_GOAL)) store.goal = it.getIntExtra(EXTRA_GOAL, store.goal)
            if (it.hasExtra(EXTRA_KPS)) store.kps = it.getFloatExtra(EXTRA_KPS, store.kps)
            if (it.hasExtra(EXTRA_STRIDE)) store.stride = it.getFloatExtra(EXTRA_STRIDE, store.stride)
        }
        counterSteps = store.todaySteps()
        pendingTs.clear()
        steps = counterSteps

        // Android 12+: FGS can only be started from the foreground; Android 14+: the type is mandatory
        // and ACTIVITY_RECOGNITION must already be granted (otherwise SecurityException).
        try {
            val n = buildNotification()
            if (Build.VERSION.SDK_INT >= 34)
                startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH)
            else
                startForeground(NOTIF_ID, n)
        } catch (e: Exception) {            // ForegroundServiceStartNotAllowedException / SecurityException
            stopSelf(); return START_NOT_STICKY
        }

        store.running = true
        sm.unregisterListener(this)
        // report immediately (no batching): maxReportLatency = 0
        sensor?.let { sm.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST, 0) }
        detector?.let { sm.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST, 0) }
        scheduleMidnight()
        ForgeBarPlugin.emitState(true)
        ForgeBarPlugin.emitSteps(steps, store.today())
        return START_STICKY
    }

    override fun onSensorChanged(e: SensorEvent) {
        if (e.sensor.type == Sensor.TYPE_STEP_DETECTOR) {
            // instant: +1 on the very step
            pendingTs.addLast(e.timestamp)
            while (pendingTs.size > 400) pendingTs.removeFirst()
        } else {
            // accurate: the hardware counter is the truth; drop detector steps it already includes
            counterSteps = store.onCounter(e.values[0].toLong())
            while (pendingTs.isNotEmpty() && pendingTs.first() <= e.timestamp) pendingTs.removeFirst()
        }
        steps = counterSteps + pendingTs.size
        refreshNotification()
        ForgeBarPlugin.emitSteps(steps, store.today())
    }

    override fun onAccuracyChanged(s: Sensor?, a: Int) {}

    private fun onNewDay() {
        store.rollover()
        counterSteps = store.todaySteps()
        pendingTs.clear()
        steps = counterSteps
        refreshNotification()
        ForgeBarPlugin.emitSteps(steps, store.today())
        scheduleMidnight()
    }

    private fun scheduleMidnight() {
        handler.removeCallbacks(midnight)
        val c = Calendar.getInstance().apply {
            add(Calendar.DAY_OF_YEAR, 1); set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0); set(Calendar.SECOND, 2); set(Calendar.MILLISECOND, 0)
        }
        handler.postDelayed(midnight, c.timeInMillis - System.currentTimeMillis())
    }

    /** goal / kcal-per-step changed from JS: redraw the notification right away */
    fun refresh() { steps = counterSteps + pendingTs.size; doRefresh() }

    fun stopFromApp() {
        store.running = false
        try { sm.unregisterListener(this) } catch (_: Exception) {}
        handler.removeCallbacks(midnight)
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
        ForgeBarPlugin.emitState(false)
    }

    override fun onDestroy() {
        if (instance === this) instance = null
        try { sm.unregisterListener(this) } catch (_: Exception) {}
        try { unregisterReceiver(dateReceiver) } catch (_: Exception) {}
        handler.removeCallbacks(midnight)
        super.onDestroy()
    }

    override fun onBind(i: Intent?): IBinder? = null

    // ---------------- notification ----------------
    private fun createChannel() {
        if (Build.VERSION.SDK_INT < 26) return
        val nm = getSystemService(NotificationManager::class.java)
        runCatching { nm.deleteNotificationChannel(OLD_CHANNEL) }      // old channel was LOW importance ("Silent" section)
        // DEFAULT importance => listed with the normal notifications at the top, not under "Silent".
        // No sound, no vibration, and setOnlyAlertOnce below => it never makes noise.
        val ch = NotificationChannel(CHANNEL, "Steps & activity", NotificationManager.IMPORTANCE_DEFAULT).apply {
            description = "Live steps, calories and distance"
            setShowBadge(false); enableVibration(false); setSound(null, null); enableLights(false)
            lockscreenVisibility = Notification.VISIBILITY_PUBLIC
        }
        nm.createNotificationChannel(ch)
    }

    private fun smallIcon(): Int {
        val id = resources.getIdentifier("ic_stat_forge", "drawable", packageName)
        return if (id != 0) id else applicationInfo.icon
    }

    private fun buildNotification(): Notification {
        val goal = store.goal
        val loc = Locale.getDefault()
        val kcal = Math.round(steps * store.kps)
        val km = steps * store.stride / 1000.0
        val pct = minOf(100, (steps * 100 / maxOf(1, goal)).toInt())
        val open = packageManager.getLaunchIntentForPackage(packageName)?.let {
            PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        }
        val stop = PendingIntent.getService(
            this, 1, Intent(this, StepService::class.java).setAction(ACTION_STOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val line1 = String.format(loc, "%,d kcal  \u2022  %.2f km", kcal, km)
        val line2 = String.format(loc, "%d%% of your %,d step goal", pct, goal)
        val b = NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(smallIcon())
            .setColor(0xFFC8F13A.toInt())
            .setContentTitle(String.format(loc, "%,d steps today", steps))
            .setContentText(line2)
            .setSubText("Forge Gym")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setOngoing(true).setOnlyAlertOnce(true).setSilent(true).setShowWhen(false)
            .setCategory(NotificationCompat.CATEGORY_STATUS)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .setContentIntent(open)

        var styled = false
        try {
            val cid = rid("notif_collapsed", "layout")
            val eid = rid("notif_expanded", "layout")
            if (cid != 0 && eid != 0) {
                val small = RemoteViews(packageName, cid)
                val big = RemoteViews(packageName, eid)
                fill(small, false, steps, goal, pct, kcal, km, loc)
                fill(big, true, steps, goal, pct, kcal, km, loc)
                b.setCustomContentView(small)
                    .setCustomBigContentView(big)
                styled = true
            }
        } catch (_: Exception) { styled = false }
        if (!styled) {
            b.setStyle(NotificationCompat.BigTextStyle().bigText(line1 + "\n" + line2))
                .setProgress(goal, minOf(steps, goal.toLong()).toInt(), false)
        }
        return b.build()
    }

    private fun rid(name: String, type: String): Int = resources.getIdentifier(name, type, packageName)

    private fun fill(v: RemoteViews, big: Boolean, steps: Long, goal: Int, pct: Int, kcal: Long, km: Double, loc: Locale) {
        val appIcon = rid("ic_launcher", "mipmap")
        if (appIcon != 0) v.setImageViewResource(rid("n_app", "id"), appIcon)
        v.setTextViewText(rid("n_steps", "id"), String.format(loc, "%,d", steps))
        v.setTextViewText(rid("n_kcal", "id"), String.format(loc, "%,d", kcal))
        v.setProgressBar(rid("n_bar", "id"), goal, minOf(steps, goal.toLong()).toInt(), false)
        if (big) {
            val left = if (steps >= goal) "Daily goal reached" else String.format(loc, "%,d to go", goal - steps)
            v.setTextViewText(
                rid("n_info", "id"),
                String.format(loc, "%d%% of %,d  \u2022  %.2f km  \u2022  %s", pct, goal, km, left)
            )
        }
    }

    /** at most one redraw per second (Android rate-limits notification updates), never loses the last value */
    private fun refreshNotification() {
        val now = SystemClock.elapsedRealtime()
        if (now - lastNotif >= 1000) { doRefresh(); return }
        if (!refreshQueued) {
            refreshQueued = true
            handler.postDelayed({ refreshQueued = false; doRefresh() }, 1000 - (now - lastNotif))
        }
    }

    private fun doRefresh() {
        lastNotif = SystemClock.elapsedRealtime()
        getSystemService(NotificationManager::class.java).notify(NOTIF_ID, buildNotification())
    }
}
