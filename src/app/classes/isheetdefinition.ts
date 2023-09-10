export interface iSheetDefinition {
    name: string;
    type_name: string;
    layer_1: Layer;
    layer_2?: Layer;
    layer_3?: Layer;
    Layer_4?: Layer;
    Layer_5?: Layer;
    Layer_6?: Layer;
    Layer_7?: Layer;
    Layer_8?: Layer;
    variants?: string[];
    match_body_color?: boolean;
    filename?: string;
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
