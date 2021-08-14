export type ViewType = "record" | "list";


export interface View {
   [ key: string ]: any;
   readonly sys_id: string;
   readonly sys_created_at: string;
   readonly sys_updated_at: string;
   name: string;
   table_name: string;
   view_type: ViewType;
}


export interface ViewQueryOptions {
   sysId?: string | undefined;
   tableName?: string | undefined;
}


export interface ViewSection {
   [ key: string ]: any;
   initialId: string;
   readonly sys_id: string;
   readonly sys_created_at: string;
   readonly sys_updated_at: string;
   view_id: string;
   section_id: string;
   name: string;
   grid_width: number;
   grid_height: number;
   section_order: number;
}


export interface ViewSectionQueryOptions {
   viewId?: string | undefined;
   sysId?: string | undefined;
}


export interface ViewFields { [ key: string ]: ViewField[]; }
export interface ViewField {
   [ key: string ]: any;
   readonly sys_id: string;
   readonly sys_created_at: string;
   readonly sys_updated_at: string;
   section_id: string;
   column_name: string;
   label: string;
   grid_x_from: number;
   grid_x_to: number;
   grid_y_from: number;
   grid_y_to: number;
}


export interface ViewFieldQueryOptions {
   columnName: string;
   sectionId: string;
}


export interface ViewOptions {
   table: string;
   name?: string | undefined;
   viewType?: string | undefined;
}


export interface ViewObject {
   view: View;
   section: ViewSection[];
   field: ViewFields;
   columns: any[];
   validation: any;
}