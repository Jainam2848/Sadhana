package expo.modules.spatialaudio

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.media.AudioManager
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.os.Build

class SpatialAudioModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SpatialAudio")

    Function("enableSpatialAudio") { enable: Boolean ->
      val context = appContext.reactContext ?: return@Function
      val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return@Function

      // Android 13 (API Level 33) introduced native Spatializer support
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        val spatializer = audioManager.spatializer
        if (spatializer.isAvailable && spatializer.isEnabled) {
          val attributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
            .build()
          
          // Check for multi-channel spatialization support (5.1 surround sound layout)
          val format = AudioFormat.Builder()
            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
            .setChannelMask(AudioFormat.CHANNEL_OUT_5POINT1)
            .build()

          val canBeSpatialized = spatializer.canBeSpatialized(attributes, format)
          // The native player automatically adapts if spatializer is enabled and content is compatible.
        }
      }
    }
  }
}
