import { type } from "os"

export type PageSetting = {
    blur: boolean;
    lastRedirect: string;
    message: string;
    messageType: 'Error' | 'Warning' | 'Success' | 'Info';
    spinner: boolean;
}
export type ExtraLoginGoogleInfo = {
    phoneNumber: string;
}
export type ExtraLoginEmailInfo = {
    displayName: string;
    phoneNumber: string;
    photoURL: string;
}
export type ProjectData = {
    projectName: string;
    projectDescription: string;
    projectTags: string[];
    projectFeatures: feature[];
}
export type feature = {
    name: string;
    icon: string;
}
export type dalaLedgerData = {
    driverName: string;
    driverImage: string;
    driverNumber: string;
    driverId: string;
    charge: number;
    ledgerNo: string;
    coordinator: string;
}
export type sitLedgerData = {
    dispatchDate: string;
    delivery: string;
    expectedDelivery: string;
    gateEntryDate: string;
    gateEntryNo: string;
    mfgLocation: string;
    productCode: string;
    productName: string;
    quantity: number;
    recPlantDesc: string;
    remarks: string;
    suppPlant: string;
    suppPlantDesc: string;
    storageLocation: string;
    transName: string;
    vehicleNo: string;
    status:"uploaded"|"pending"|"received"|"unloaded";
}
export type SIT = {
    id:string;
    status:'uploaded'|'pending'|'received'|'unloaded';
    supplierCode:string;
    supplierName: string;
    sit:Stock[];
    uploadTime:any;
    views:number;
}
export type Stock = {
    deliveryCode: string;
    dispatchDate: string;
    expectedDelivery: string;
    gateEntryDate: string;
    gateEntryNumber: string;
    mfgLocation: string;
    productCode: string;
    productName: string;
    quantity: number;
    recievePlantName: string;
    storageLocation: string;
    supplyPlantCode: string;
    supplyPlantName: string;
    transporterName: string;
    vehicleNo: string;
}
export type LabourLedgerData = {
        Name: string;
        Lastname: string;
        Code: string;
        Paid: number;

}
export type expenseledgerData = {
    expenseName:string;
    ledgerNo:string;
    charge:number;
    condition:'danger'|'success'|'warning'|'primary';
    servicable:boolean; 
    reason:string;
    date:string;
    starred:boolean;
}
export type messageAlert = {
    title:string;
    status:'danger'|'success'|'warning'|'primary';
    description:string;
    date:string;
    type:'messageAlert';
}
export type confirmationAlert = {
    title:string;
    description:string;
    handler:any;
    type:'confirmationAlert';
}
export type dialogAlert = {
    title:string;
    description:string;
    handler:any;
    type:'dialogAlert';
}
export type actionsAlert = {
    title: string;
    actions:actionButtonData[];
    type:'actionsAlert';
}
export type actionButtonData = {
    title?:string;
    icon?: string;
    handler:any;
}
export type BasicUser = {
    name: string;
    email: string;
    image: string;
    access: string;
    firstLogin: string;
    uid:string;
}