export class UserSettings {
  currentDirectory?: string;
  latestPageViewsByDirectory: { [key: string]: string[] }; // using Map results in serialization annoyances

  constructor() {
    this.currentDirectory = null;
    this.latestPageViewsByDirectory = {};
  }
}
