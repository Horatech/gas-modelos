export interface ICreateApplicationOrbiwise {
  accountid: string; // name or id of application
  password: string; // password, optional, if not provided, it is auto generated.
  can_register: boolean; // can administer device
  can_access_gtw_info: boolean; // will receive info about gateways that received messages and can query position of general gateways
  can_own_gtw: boolean; // can own gateways
  can_add_gtw: boolean; // can add/remove gateways
  can_mng_gtw: boolean; // can manage setting on gateway
  loraloc_enable: boolean; // can enable lora location on devices
}
