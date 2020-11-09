
/**********************
 * GENERIC EVENTS
 **********************/
export const LOGS_NEW_ERROR = 'HMI.API.Services.OpcUa.ApiModels.Log';
export const LOGS_ANOTHER_KIND_OF_ERROR = 'LOGS_ANOTHER_KIND_OF_ERROR';
// export const UPDATED_NODE = 'UPDATED';
// export const NOTIFIED_NODE = 'NOTIFIED';

export type SockeTEventType =
    typeof LOGS_NEW_ERROR
  | typeof LOGS_ANOTHER_KIND_OF_ERROR
  ;

export interface EventMessage<T> {
  message: T;
  type: SockeTEventType;
}

/**********************
 * LOGS_NEW_ERROR EVENT
 **********************/

export interface LogsNewErrorEventMessageAPI {
  /** Example:
   * Actions: "Lore Ipsum Actions 1255489"
   * Code: "Code 1255489"
   * Date: "2020-11-05T11:27:41.8024475Z"
   * Description: "Lore Ipsum Description $1255489"
   * Id: 100
   * IsAcknowledged: true
   * Module: "Module 1255489"
   * Title: "Lore Ipsum Title 1255489"
   * Type: "Info"
   */

  Actions: string;
  Code: string;
  Date: string;
  Description: string;
  Id: number;
  IsAcknowledged: boolean;
  Module: string;
  Title: string;
  Type: string;
}

export interface LogsNewErrorEvent extends EventMessage<LogsNewErrorEventMessageAPI> {
  type: typeof LOGS_NEW_ERROR;
}

/**********************
 * LOGS_ANOTHER_KIND_OF_ERROR EVENT
 **********************/

export interface LogsAnotherExampleEventMessageAPI {
  id: string;
  title: string;
}

export interface LogsAnotherExampleEvent extends EventMessage<LogsAnotherExampleEventMessageAPI> {
  type: typeof LOGS_ANOTHER_KIND_OF_ERROR;
}


// prettier-ignore
export type EventTypes =
  | LogsNewErrorEvent
  | LogsAnotherExampleEvent
  ;
