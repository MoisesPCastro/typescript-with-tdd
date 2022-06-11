export class ServerParamError extends Error {
    constructor (){
        super('Interval server error');
        this.name = 'ServerParamError';
    };
};