using {saveapi as my} from '../db/schema';
using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER.csn';

@requires: 'authenticated-user'
service ReceiverService {
    entity SavedBusinessPartner as projection on my.SavedBusinessPartner;

    @requires: 'viewer'
    @readonly entity BusinessPartners as projection on external.A_BusinessPartner;

    function ApiGet (id : String) returns String;
}