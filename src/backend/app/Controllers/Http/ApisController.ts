import { Configuration } from 'Database/entities/configuration';
import { Response, Request } from 'express';

export default class ApisController {
    static async greet(request: Request, response: Response) {
        response.json({ greeting: `Hello, ${request.query.name}` });
    }

    static async configurations(request: Request, response: Response){
        const configuration = await Configuration.find(); //ibabalik nya lahat ng configurations
        //pwede rin Configuration.findBy({
        // key: "something"
        // }) para mas specific

        response.json({
            status: 1,
            data: configuration
        });
    }

    static async insert_configuration(request: Request, response: Response){
        const { key, value } = request.body;

        const checkIfExist = await Configuration.findBy({ key });
        //checheck muna kung existing para hindi magkaduplicates
        console.log(checkIfExist);
        
        if(checkIfExist){
            response.status(400);
            return response.json({
                status: 0,
                message: "Configuration already exists!"
            });
        } 

        //iinsert na kapag ok na
        await Configuration.insert({key, value});

        response.json({
            status: 1,
            message: "Configuration has been inserted!",
        });
    }

    static async update_configuration(request: Request, response: Response){
        const { key, value } = request.body;
        const getConfiguration = await Configuration.findBy({ key });

        if(!getConfiguration){ // if hindi nageexist yung dapat na iuupdate na data magrereturn ng error
            return response.json({
                status: 0,
                message: "Configuration not found!"
            });
        }
        // if nageexist, iuupdate na nya yung value
        
        await Configuration.update({ key }, { value });
        response.json({
            status: 1,
            message: "Configuration has been updated!",
        });
    }

    static async delete_configuration(request: Request, response: Response){
        const { key } = request.body;
        const getConfiguration = await Configuration.findBy({ key });

        if(!getConfiguration){ // if hindi nageexist yung dapat na idedelete na data, magrereturn ng error
            return response.json({
                status: 0,
                message: "Configuration not found!"
            });
        }

        // if nageexist idedelete na nya
        await Configuration.delete({ key });

        response.json({
            status: 1,
            message: "Configuration has been deleted!",
        });
    }
}