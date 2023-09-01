import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { SectionGrid } from "react-native-super-grid";
import SearchBar from "../components/SearchBar";
import { commonStyles } from '../style/CommonStyle';
import imageMapping from "../utils/imageMapping";

let SQLite = require('react-native-sqlite-storage');

export default class MenuScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            searchPhrase: "",
            clicked: false,
        };
        this._query = this._query.bind(this);
        this.db = SQLite.openDatabase(
            { name: 'coffeeDatabase' },
            this.openCallback,
            this.errorCallback,
        )
    }

    componentDidMount() {
        this._query();
    }

    _query(){
        this.db.transaction(tx =>
            tx.executeSql('SELECT id, name, base_price, type FROM items', [], (tx, results) => {
                const itemsArray = [];
                for (let i = 0; i < results.rows.length; i++) {
                    const item = results.rows.item(i);
                    const { id, name, base_price: price, type} = item;
                    itemsArray.push({ id, name, price, type });
                }
                this.setState({
                    items: itemsArray
                }, () => {
                    console.log(this.state.items); // Debug purpose
                });
            }
            ));
    }

    handleItemDetail = (itemId) => {
        this.props.navigation.navigate('Coffee', {
            itemId,
        });
    };

    handleSearchPhraseChange = (newSearchPhrase) => {
        this.setState({
            searchPhrase: newSearchPhrase,
        });
    };

    setClicked = (isClicked) => {
        this.setState({
            clicked: isClicked,
        });
    };

    openCallback() {
        console.log('database open success');
    }

    errorCallback(err) {
        console.log('Error in opening database :' + err);
    }

    organizeDataIntoSections(data) {
        const sections = {};

        // Organize items into sections based on their types
        data.forEach(item => {
            if (!sections[item.type]) {
                sections[item.type] = [];
            }
            sections[item.type].push(item);
        });

        // Convert sections object into an array of sections
        const sectionArray = Object.keys(sections).map(type => ({
            title: type,
            data: sections[type],
        }));

        return sectionArray;
    }

    render() {
        return (
            <View style={commonStyles.container}>
                <View>
                    <SearchBar
                        searchPhrase={this.state.searchPhrase}
                        setSearchPhrase={this.handleSearchPhraseChange}
                        clicked={this.state.clicked}
                        setClicked={this.setClicked}
                    />
                </View>
                <SectionGrid
                    itemDimension={120}
                    sections={this.organizeDataIntoSections(this.state.items)}
                    style={commonStyles.gridView}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => this.handleItemDetail(item.id)}>
                            <View style={[commonStyles.itemContainer]}>
                                <Image
                                    source={imageMapping[item.name]} // Update the path accordingly
                                    style={{ width: 50, height: 100, alignSelf: 'center' }}
                                />
                                <Text style={commonStyles.itemName}>{item.name}</Text>
                                <Text style={commonStyles.itemName}>RM {item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section }) => (
                        <Text style={commonStyles.sectionHeader}>{section.title}</Text>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center',
    },
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    itemContainer:
    {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName:
    {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode:
    {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    sectionHeader: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'center',
        backgroundColor: '#0f4c81',
        color: 'white',
        padding: 10,
    },
})
