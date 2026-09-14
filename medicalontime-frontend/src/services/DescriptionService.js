import api from './api';

class DescriptionService {
    // Staff only. A patient reads their own treatment history through MeService.
    getDescriptions(){
        return api.get('/descriptions');
    }

    // The author is taken from the token server side, so it is not sent.
    createDescription(description){
        return api.post('/descriptions', description);
    }

    getDescriptionById(descriptionId){
        return api.get(`/descriptions/${descriptionId}`);
    }

    updateDescription(description, descriptionId){
        return api.put(`/descriptions/${descriptionId}`, description);
    }

    deleteDescription(descriptionId){
        return api.delete(`/descriptions/${descriptionId}`);
    }
}

export default new DescriptionService()
