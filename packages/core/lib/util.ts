interface IResult {
    code?:number;
    message?:string;
    result: any;
}
export const responseFormatter = (params?:IResult) => {
    if (!params) {
        return {
            code: 404,
            message: 'NOT_FOUND'
        }
    }
    if (!params.code) {
        return {
            code: 200,
            result: params.result
        }
    }
    return {
        code: params.code,
        message: params.message
    }
}