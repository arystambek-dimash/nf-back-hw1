import {Request, Response} from 'express';
import {CreateEventDto} from './dtos/CreateEvent.dot';
import EventService from './event-service';
import {use} from "passport";

class EventController {
    private eventService: EventService;


    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const createEventDto: CreateEventDto = req.body;
            const event = await this.eventService.createEvent(createEventDto);
            res.status(201).json(event);
        } catch (error: any) {
            res.status(500).send({error: error.message});
        }
    }


    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const sortBy = req.query.sortBy as string
            const sortDirection = req.query.sortDirection as string
            const location =
                (req.query.location as string) ||
                ((req as any).user ? ((req as any).user.city as string) : null) ||
                null;
            if (sortBy && sortDirection) {
                res.status(200).json(await this.eventService.filterEvent(sortBy, sortDirection, location))
                return;
            }
            const events = await this.eventService.getEvents(location);
            const start_index = (page - 1) * limit;
            const end_index = start_index + limit
            res.status(200).json(events.slice(start_index, end_index));
        } catch (error: any) {
            res.status(500).send({error: error.message});
        }
    }


    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const {id} = req.params;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({message: 'Event not found'});
                return;
            }
            res.status(200).json(event);
        } catch (error: any) {
            res.status(500).send({error: error.message});
        }
    }

}

export default EventController;