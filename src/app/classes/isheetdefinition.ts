export interface iSheetDefinition {
    name: string;
    type_name: string;
    layer_1: Layer;
    layer_2?: Layer;
    layer_3?: Layer;
    layer_4?: Layer;
    layer_5?: Layer;
    layer_6?: Layer;
    layer_7?: Layer;
    layer_8?: Layer;
    variants?: string[];
    match_body_color?: boolean;
    filename?: string;
    filepath?: string;
}

export interface Layer {
    zPos: number;
    male?: string;
    muscular?: string;
    female?: string;
    pregnant?: string;
    teen?: string;
    child?: string;
}
