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




import "reflect-metadata";
import { Container } from "inversify";
import { PkAcl } from "@symlinkde/eco-os-pk-models";
import { AclService } from "./AclService";
import { ACL_TYPES } from "./AclTypes";
import { AclProcessor } from "./AclProcessor";
import { AclTargetProcessor } from "./AclTargetProcessor";

const aclContainer = new Container();
aclContainer
  .bind<PkAcl.IAclService>(ACL_TYPES.IAclService)
  .to(AclService)
  .inSingletonScope();
aclContainer.bind<PkAcl.IAclProcessor>(ACL_TYPES.IAclProcessor).to(AclProcessor);
aclContainer.bind<PkAcl.IAclTargetProcessor>(ACL_TYPES.IAclTargetProcessor).to(AclTargetProcessor);
export { aclContainer };
