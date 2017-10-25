import * as _ from 'lodash';

export class Theme {
    public backgroundColor: string = '#eeeeee';
    public textColor: string = '#333333';
    public accentColor: string = '#ffffff';
    public textOnAccentColor: string = '#333333';

    public constructor(values?: Partial<Theme>) {
        _.forEach(values, (value: string, key: string) => {
            _.set(this, key, value);
        });
    }
}
