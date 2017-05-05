export class CalendarOptions {
    timepicker: boolean;
    format12h: boolean;
    fullDays: boolean;
    language: string;
    hourStep: number;
    minuteStep: number;

    /**
     * Creates an instance of CalendarOptions.
     *
     * @memberOf CalendarOptions
     */
    constructor() {
        this.timepicker = false;
        this.format12h = false;
        this.fullDays = false;
        this.language = 'en';
        this.hourStep = 1;
        this.minuteStep = 1;
    }
}

export class CalendarLanguage {
    days: string[];
    daysMin: string[];
    months: string[];

    /**
     * Creates an instance of CalendarLanguage.
     * @param {Array<string>} days
     * @param {Array<string>} daysMin
     * @param {Array<string>} months
     *
     * @memberOf CalendarLanguage
     */
    constructor(days: string[], daysMin: string[], months: string[]) {
        this.days = days;
        this.daysMin = daysMin;
        this.months = months;
    }
}

export class CalendarMonth {
    month: number;
    year: number;

    /**
     * Creates an instance of CalendarMonth.
     * @param {any} month
     * @param {any} year
     *
     * @memberOf CalendarMonth
     */
    constructor(month, year) {
        if (month > 11) {
            year++;
            month = 0;
        } else if (month < 0) {
            year--;
            month = 11;
        }

        this.month = month;
        this.year = year;
    }
}

export class CalendarDay {
    date: number;
    weekend: boolean;
    other: boolean;
    current: boolean;
    selected: boolean;

    /**
     * Creates an instance of CalendarDay.
     * @param {number} date
     * @param {boolean} [weekend=false]
     * @param {boolean} [other=false]
     * @param {boolean} [current=false]
     * @param {boolean} [selected=false]
     *
     * @memberOf CalendarDay
     */
    constructor(date: number, weekend: boolean = false, other: boolean = false, current: boolean = false, selected: boolean = false) {
        this.date = date;
        this.weekend = weekend;
        this.other = other;
        this.current = current;
        this.selected = selected;
    }
}

export class CalendarWeekend {
    day: number;

    /**
     * Creates an instance of CalendarWeekend.
     * @param {number} [day=0]
     *
     * @memberOf CalendarWeekend
     */
    constructor(day: number = 0) {
        this.day = day;
    }

    progress(): boolean {
        let weekend = false;

        if (this.day === 5 /* Saturday */) {
            weekend = true;
            ++this.day;
        } else if (this.day === 6 /* Sunday */) {
            weekend = true;
            this.day = 0; // it's a new week!
        } else {
            ++this.day;
        }

        return weekend;
    }
}

export const LANGUAGES: Map<string, CalendarLanguage> = new Map([
    ['cs', new CalendarLanguage(
        ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
        ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
        ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
    )] as [string, CalendarLanguage],

    ['da', new CalendarLanguage(
        ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
        ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'],
        ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December']
    )] as [string, CalendarLanguage],

    ['de', new CalendarLanguage(
        ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
        ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    )] as [string, CalendarLanguage],

    ['en', new CalendarLanguage(
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    )] as [string, CalendarLanguage],

    ['es', new CalendarLanguage(
        ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
        ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    )] as [string, CalendarLanguage],

    ['fi', new CalendarLanguage(
        ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'],
        ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'],
        ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu']
    )] as [string, CalendarLanguage],

    ['fr', new CalendarLanguage(
        ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
    )] as [string, CalendarLanguage],

    ['hu', new CalendarLanguage(
        ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'],
        ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V'],
        ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December']
    )] as [string, CalendarLanguage],

    ['it', new CalendarLanguage(
        ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
        ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
        ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    )] as [string, CalendarLanguage],

    ['jp', new CalendarLanguage(
        ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'],
        ['月', '火', '水', '木', '金', '土', '日'],
        ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    )] as [string, CalendarLanguage],

    ['nl', new CalendarLanguage(
        ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
        ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
        ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
    )] as [string, CalendarLanguage],

    ['pl', new CalendarLanguage(
        ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
        ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So', 'Nd'],
        ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
    )] as [string, CalendarLanguage],

    ['pt', new CalendarLanguage(
        ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        ['Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa', 'Do'],
        ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    )] as [string, CalendarLanguage],

    ['ro', new CalendarLanguage(
        ['Luni', 'Marţi', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
        ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa', 'Du'],
        ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']
    )] as [string, CalendarLanguage],

    ['sk', new CalendarLanguage(
        ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'],
        ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'],
        ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December']
    )] as [string, CalendarLanguage],

    ['zh', new CalendarLanguage(
        ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        ['一', '二', '三', '四', '五', '六', '日'],
        ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    )] as [string, CalendarLanguage],

]);