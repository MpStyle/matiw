import {StringUtils} from "./StringUtils.ts";

export const MGroupedIcons: { [key: string]: { [iconName: string]: string } } = {
    // Shapes
    "shape": {
        "location_pin": "\uf1db",
        "square": "\ueb36",
        "circle": "\uef4a",
        "star": "\ue838",
        "favorite": "\ue87d",
        "format_quote": "\ue244",
        "check": "\ue5ca",
        "close": "\ue5cd",
    },

    // Sports
    "sport": {
        "sports": "\uea30",
        "sports_bar": "\uf1f3",
        "sports_baseball": "\uea51",
        "sports_basketball": "\uea26",
        "sports_cricket": "\uea27",
        "sports_esports": "\uea28",
        "sports_football": "\uea29",
        "sports_golf": "\uea2a",
        "sports_gymnastics": "\uebc4",
        "sports_handball": "\uea33",
        "sports_hockey": "\uea2b",
        "sports_kabaddi": "\uea34",
        "sports_martial_arts": "\ueae9",
        "sports_mma": "\uea2c",
        "sports_motorsports": "\uea2d",
        "sports_rugby": "\uea2e",
        "sports_score": "\uf06e",
        "sports_soccer": "\uea2f",
        "sports_tennis": "\uea32",
        "sports_volleyball": "\uea31",
    },

    // Locals:
    "local": {
        "home": "\ue88a",
        "apartment": "\uea40",
        "real_estate_agent": "\ue73a",
        "cottage": "\ue587",
        "bed": "\uefdf",
        "chair": "\uefed",
        "coffee": "\uefef",
        "bungalow": "\ue591",
        "chalet": "\ue585",
        "garage_door": "\ue714",
        "local_activity": "\ue53f",
        "local_airport": "\ue53d",
        "local_atm": "\ue53e",
        "local_attraction": "\ue53f",
        "local_bar": "\ue540",
        "local_cafe": "\ue541",
        "local_car_wash": "\ue542",
        "local_convenience_store": "\ue543",
        "local_dining": "\ue556",
        "local_drink": "\ue544",
        "local_fire_department": "\uef55",
        "local_florist": "\ue545",
        "local_gas_station": "\ue546",
        "local_grocery_store": "\ue547",
        "local_hospital": "\ue548",
        "local_hotel": "\ue549",
        "local_laundry_service": "\ue54a",
        "local_library": "\ue54b",
        "local_mall": "\ue54c",
        "local_movies": "\ue54d",
        "local_offer": "\ue54e",
        "local_parking": "\ue54f",
        "local_pharmacy": "\ue550",
        "local_phone": "\ue551",
        "local_pizza": "\ue552",
        "local_play": "\ue553",
        "local_police": "\uef56",
        "local_post_office": "\ue554",
        "local_print_shop": "\ue555",
        "local_printshop": "\ue555",
        "local_restaurant": "\ue556",
        "local_see": "\ue557",
        "local_shipping": "\ue558",
        "local_taxi": "\ue559",
    },

    // Transport
    "transport": {
        "directions": "\ue52e",
        "directions_bike": "\ue52f",
        "directions_boat": "\ue532",
        "directions_boat_filled": "\ueff5",
        "directions_bus": "\ue530",
        "directions_bus_filled": "\ueff6",
        "directions_car": "\ue531",
        "directions_car_filled": "\ueff7",
        "directions_ferry": "\ue532",
        "directions_off": "\uf10f",
        "directions_railway": "\ue534",
        "directions_railway_filled": "\ueff8",
        "directions_run": "\ue566",
        "directions_subway": "\ue533",
        "directions_subway_filled": "\ueff9",
        "directions_train": "\ue534",
        "directions_transit": "\ue535",
        "directions_transit_filled": "\ueffa",
        "directions_walk": "\ue536",
    },
}

export const MIconGroups = Object.keys(MGroupedIcons);
export const MIcons: { [p: string]: string } = Object.values(MGroupedIcons).reduce((acc, obj) => {
    return {...acc, ...obj};
}, {});
export const MDefaultIconName = "location_pin";
export const MDefaultIconColor = "#3b3b3b";
export const getMIconName = (mIconName: string, capitalize?: boolean) => {
    let iconName = mIconName;
    if (capitalize) {
        iconName = StringUtils.capitalize(iconName);
    }
    return iconName.replace(new RegExp("_", 'g'), " ");
}