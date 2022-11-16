import jwt from "jsonwebtoken";

const Helpers = {
    createToken: async (payload: any, secret: string, expiryDate: string) => {
        // console.log(payload, secret, expiryDate)
        return jwt.sign(
            payload,
            secret.toString(),
            {
                expiresIn: expiryDate.toString(),
            }
        );
    },
    timeConvert: (duration: number, unit: string) => {
        switch (unit) {
            case 'm':
                return duration * 60;
            case 'h':
                return duration * 60 * 60;
            case 'd':
                return duration * 60 * 60 * 24;
            default:
                return duration;
        }
    },
    addTime: (offset: number, unit: string) => {
        switch (unit) {
            case 's':
                return Date.now() + offset * 1000;
            case 'm':
                return Date.now() + offset * 60 * 1000;
            case 'h':
                return Date.now() + offset * 60 * 60 * 1000;
            case 'd':
                return Date.now() + offset * 24 * 60 * 60 * 1000;
            default:
                return Date.now();
        }
    },
    removeSecretFields: (data: any, fields: Array<string>) => {
        fields.forEach(f => {
            delete data[f];
        })
        return data;
    }
}
export default Helpers