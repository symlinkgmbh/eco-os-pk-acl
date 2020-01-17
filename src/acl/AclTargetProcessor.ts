/**
 * Copyright 2018-2020 Symlink GmbH
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




import { PkAcl } from "@symlinkde/eco-os-pk-models";
import { inject, injectable } from "inversify";
import { ACL_TYPES } from "./AclTypes";

@injectable()
export class AclTargetProcessor implements PkAcl.IAclTargetProcessor {
  private aclService: PkAcl.IAclService;

  constructor(@inject(ACL_TYPES.IAclService) aclService: PkAcl.IAclService) {
    this.aclService = aclService;
  }

  public async processTargetPermisson<T extends PkAcl.IAclRequest>(role: string, req: T): Promise<boolean> {
    const actions = await this.loadAllowedActions(role);
    let shouldRoute = false;

    if (actions.length < 1) {
      return true;
    }

    const { method, path } = req;

    for (const index in actions) {
      if (!this.hasWildCard(actions[index].path)) {
        if (actions[index].method === method && actions[index].path === path) {
          shouldRoute = true;
        }
      } else {
        if (actions[index].method === method && this.splitCall(actions[index].path) === this.splitCall(path)) {
          shouldRoute = true;
        }
      }
    }

    return shouldRoute;
  }

  private async loadAllowedActions(role: string): Promise<Array<PkAcl.IAclRequest>> {
    const aclEntry: PkAcl.IAclEntry = await this.aclService.getAclEntryForRole(role);
    return aclEntry.allowedActions;
  }

  private hasWildCard(actionPath: string): boolean {
    if (actionPath.substring(actionPath.length - 1) === "*") {
      return true;
    }

    return false;
  }

  private splitCall(action: string): string {
    return action.substring(0, action.lastIndexOf("/"));
  }
}
