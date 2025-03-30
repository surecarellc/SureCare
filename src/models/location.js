// models/User.js

export class location {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  
    getDisplayName() {
      return `${this.name}`;
    }
  }
  