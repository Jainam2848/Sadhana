import ExpoModulesCore
import AVFoundation

public class SpatialAudioModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SpatialAudio")

    Function("enableSpatialAudio") { (enable: Bool) in
      let session = AVAudioSession.sharedInstance()
      do {
        if enable {
          // Playback mode with longFormAudio policy to enable Dolby Atmos and multichannel rendering
          try session.setCategory(.playback, mode: .default, policy: .longFormAudio, options: [])
          
          if #available(iOS 15.0, *) {
            // Tells the system to prioritize continuous audio flow for ambient tracks
            try session.setPrefersNoInterruptionsFromSystemAlerts(true)
          }
          
          try session.setActive(true)
        } else {
          try session.setActive(false, options: .notifyOthersOnDeactivation)
        }
      } catch {
        print("[SpatialAudioModule] Failed to configure AVAudioSession: \(error.localizedDescription)")
      }
    }
  }
}
