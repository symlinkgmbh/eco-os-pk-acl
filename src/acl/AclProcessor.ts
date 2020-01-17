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
import { injectable, inject } from "inversify";
import { ACL_TYPES } from "./AclTypes";

@injectable()
class AclProcessor implements PkAcl.IAclProcessor {
  private aclService: PkAcl.IAclService;

  constructor(@inject(ACL_TYPES.IAclService) aclService: PkAcl.IAclService) {
    this.aclService = aclService;
  }

  public async processObject<T extends PkAcl.IAclDictonary>(role: string, processingObject: T): Promise<T> {
    const forbiddenAttributes: Array<string> = await this.loadForbiddenAttributes(role);

    if (forbiddenAttributes.length < 1) {
      return processingObject;
    }

    for (const forbdiddenAttributeIndex in forbiddenAttributes) {
      await delete processingObject[forbiddenAttributes[forbdiddenAttributeIndex]];
    }

    return processingObject;
  }

  public async processObjects<T extends PkAcl.IAclDictonary>(
    role: string,
    processObjects: Array<T>,
  ): Promise<Array<T>> {
    const forbiddenAttributes: Array<string> = await this.loadForbiddenAttributes(role);

    if (forbiddenAttributes.length < 1) {
      return processObjects;
    }

    for (const index in processObjects) {
      for (const forbdiddenAttributeIndex in forbiddenAttributes) {
        await delete processObjects[index][forbiddenAttributes[forbdiddenAttributeIndex]];
      }
    }

    return processObjects;
  }

  private async loadForbiddenAttributes(role: string): Promise<Array<string>> {
    const aclEntry: PkAcl.IAclEntry = await this.aclService.getAclEntryForRole(role);
    return aclEntry.forbiddenAttributes;
  }
}

export { AclProcessor };
