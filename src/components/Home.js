import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { medals: [], countries: [], loading: false };//maybe do not need state for countries
    }

   componentDidMount() {
        Promise
            .all([this.populateMedalData(), this.populateCountryList()])
            .then(() =>
            {
                this.setState({ ...this.state, loading: false });
            });
    }

    static renderMedalCountrysTable({ medals, countries }) {
        const numricWidth = 120;
        const textWidth = 150;

        const medalWithArCountries = medals.map(x => {
            const arabicName = countries.find(c =>
                        c.alpha_3 === x.c_NOCShort
                        ||
                        c.name_en === x.c_NOC
                        ||
                        (c.alpha_3 === 'RUS' && x.c_NOCShort === 'ROC')
                    )?.name_ar;

            return {
                ...x,
                countryAr: arabicName
            }
        });

        const columns = [
            {
                field: 'n_RankTotal',
                headerName: 'ترتيب المجموع',
                width: 200,
            },
            {
                field: 'c_NOCShort',
                headerName: 'رمز الدولة',
                width: textWidth,
            },
            {
                field: 'countryAr',
                headerName: 'الدولة',
                width: textWidth,
            },
            //{
            //    field: 'c_NOC',
            //    headerName: 'الدولة',
            //    width: 150,
            //    sortable: false,
            //    valueGetter: (params) => {
            //        return countries?.find(x =>
            //            (x.alpha_3 === params.getValue(params.id, 'c_NOCShort')
            //            ||
            //            x.name_en === params.getValue(params.id, 'c_NOC'))
            //            ||
            //            (x.alpha_3 === 'RUS' && params.getValue(params.id, 'c_NOCShort') === 'ROC')
            //        )?.name_a;
            //    },
            //},
            {
                field: 'n_Gold',
                headerName: 'الذهب',
                type: 'number',
                width: numricWidth,
            },
            {
                field: 'n_Silver',
                headerName: 'الفضة',
                type: 'number',
                width: numricWidth,
            },
            {
                field: 'n_Bronze',
                headerName: 'البرونز',
                type: 'number',
                width: numricWidth,
            },
            {
                field: 'n_Total',
                headerName: 'المجموع',
                type: 'number',
                width: numricWidth,
            },
        ];
        return (
        <div>
            <h1 className="right-align">
                ترتيب الدول في اولمبياد طوكيو 2020
                  </h1>
            <div id="parnentreact" style={{ height: 900, width: '100%' }}>
                <DataGrid
                    autoHeight={true}
                    autoPageSize={true}
                    rows={medalWithArCountries}
                    columns={columns}
                    getRowId={(r) => r.n_NOCGeoID}
                    className={"right-align"}
                    disableSelectionOnClick
                    loading={true}
                />
            </div>
        </div >
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>تحميل...</em></p>
            : Home.renderMedalCountrysTable(this.state);

        return (contents);
  }

  async populateMedalData() {
      const medalResponse = await fetch('https://og2020-api.sports.gracenote.com/svc/games_v2.svc/json/GetMedalTable_Season?competitionSetId=1&season=2021&languageCode=2');
      const medalData = await medalResponse.json();
      this.setState({ ...this.state, medals: medalData.MedalTableNOC });
    }
  async populateCountryList() {
      const countriesResponse = await fetch('https://raw.githubusercontent.com/faru-khan/countries_nationalities_en_ar/master/data.json');
      const countriesData = await countriesResponse.json();
      this.setState({ ...this.state, countries: countriesData });
    }
}