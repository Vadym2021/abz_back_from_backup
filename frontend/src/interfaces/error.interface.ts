export interface IError {
    success: boolean;
    message?: string;
    status: number;
    fails?: {
        [key: string]: string[];
    } | undefined;
}




