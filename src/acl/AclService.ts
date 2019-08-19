/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import Config from "config";
import { injectable } from "inversify";
import { PkAcl } from "@symlinkde/eco-os-pk-models";

@injectable()
class AclService implements PkAcl.IAclService {
  private aclConfig: PkAcl.IAclConfig;

  constructor() {
    if (!Config.has("acl")) {
      this.aclConfig = <PkAcl.IAclConfig>{ description: "fallback acl", entries: [] };
    }

    this.aclConfig = Config.get("acl");
  }

  public async getFullAcl(): Promise<Array<PkAcl.IAclEntry>> {
    return this.aclConfig.entries;
  }

  public async getAclEntryForRole(role: string): Promise<PkAcl.IAclEntry> {
    let aclEntry: PkAcl.IAclEntry = {
      role: "",
      forbiddenAttributes: [],
      allowedActions: [],
    };

    for (const entry in this.aclConfig.entries) {
      if (this.aclConfig.entries[entry].role === role) {
        aclEntry = this.aclConfig.entries[entry];
      }
    }

    return aclEntry;
  }

  public async getAclDescription(): Promise<string> {
    return this.aclConfig.description;
  }
}

export { AclService };
