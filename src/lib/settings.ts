export class UserSettings {
  currentDirectory?: string;
  directories: string[]; // allow for consistent ordering
  latestPageViewsByDirectory: { [key: string]: string[] }; // using Map results in serialization annoyances

  constructor() {
    this.currentDirectory = null;
    this.directories = [];
    this.latestPageViewsByDirectory = {};
  }
}
