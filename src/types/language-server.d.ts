// interface Command {
//     command: string
//     arguments: string[]
//     title: string
// }
//
// interface SignInResponse {
//     userCode: string
//     command: Command
// }
//
// interface StatusNotification {
//     message: string
//     kind: "Normal" | "Error" | "Warning" | "Inactive"
// }
//
// interface AuthResponse {
//     user: string
// }

interface ConfigurationParams {
  items: ConfigurationItem[]
}

interface ConfigurationItem {
  /**
   * The scope to get the configuration section for.
   */
  scopeUri?: URI

  /**
   * The configuration section asked for.
   */
  section?: string
}
