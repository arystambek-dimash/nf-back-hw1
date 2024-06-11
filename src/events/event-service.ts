import {CreateEventDto} from './dtos/CreateEvent.dot';
import EventModel, {IEvent} from './models/Event';


// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {

    async getEventById(id: string): Promise<IEvent | null> {
        return await EventModel.findById(id).exec();
    }

    async getEvents(location: any): Promise<IEvent[]> {
        const filter = location ? { location: { $regex: new RegExp(`^${location}$`, 'i') } } : {};
        return await EventModel.find(filter).exec();
    }

    async filterEvent(attr: string, option: string, location: any): Promise<IEvent[]> {
        const sortOrder = option === 'asc' ? 1 : -1;
        const filter = location ? { location: { $regex: new RegExp(`^${location}$`, 'i') } } : {};

        return await EventModel.find(filter).sort({[attr]: sortOrder}).exec();
    }


    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
        const {name, description, date, location, duration} = createEventDto;
        const newEvent = new EventModel({
            name,
            description,
            date: new Date(date),
            location,
            duration
        });

        await newEvent.save();
        return newEvent;
    }


}

export default EventService;
  