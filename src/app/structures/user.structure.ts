export type UserData = {
    userId:string;
    displayName:string;
    email:string;
    phoneNumber?:string;
    photoURL:string;
    access:UserAccess;
    status:UserStatus;
    assignedClients:string[];
    assignedProjects:string[];
    assignedProperties:string[];
}

export type UserStatus = {
    isOnline:boolean;
    access:'active' | 'inactive' | 'blocked' | 'deleted';
}
export type UserAccess={
    access:'admin'|'guest'|'agent'|'supervisor';
}
