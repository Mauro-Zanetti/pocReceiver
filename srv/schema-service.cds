using {saveapi as my} from '../db/schema';
using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER.csn';

service ReceiverService {
    entity SavedBusinessPartner as projection on my.SavedBusinessPartner;
    @readonly entity BusinessPartners as projection on external.A_BusinessPartner;
    function ApiGet (id : String) returns String;
}