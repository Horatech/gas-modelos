export interface IApplicationOrbiwise {
  accountid: string;
  app_uuid: string;
  can_register: boolean; // can administer device
  can_access_gtw_info: boolean;
  can_own_gtw: boolean; // can own gateways
  can_add_gtw: boolean; // can add/remove gateways
  can_mng_gtw: boolean; // can manage setting on gateway
  loraloc_enable: boolean; // can enable lora location on devices
}
