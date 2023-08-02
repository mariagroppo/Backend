import winston from 'winston';

export default class Loggers {
    constructor (env) {
        //Defino niveles y colores propios.
        this.options = {
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                http: 3,
                info: 4,
                debug: 5,
            },
            colors: {
                fatal: 'red',
                error: 'yellow',
                warning: 'magenta',
                http: 'orange',
                info: 'white',
                debug: 'green',
            },
        };
        //winston.addColors(this.options.colors);
        this.logger = this.createLogger(env);
    }

    createLogger = (env) => {
        const format = winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple()
        );
        switch (env) {
            case 'DEV':
                return winston.createLogger({
                    levels: this.options.levels,
                    format,
                    transports: [
                        //Muestra por consola desde debug
                        new winston.transports.Console({
                            level: 'debug',
                        }),
                        //Guarda en archivo desde warning
                        new winston.transports.File({
                            level: 'warning',
                            filename: './errors.log',
                        }),
                    ],
                });
            case 'PROD':
                return winston.createLogger({
                    levels: this.options.levels,
                    format,
                    transports: [
                        new winston.transports.Console({ level: 'info' }),
                        new winston.transports.File({
                            level: 'warning',
                            filename: './errors.log',
                        }),
                    ],
                });
        }
    };
}