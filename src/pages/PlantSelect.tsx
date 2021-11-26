import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';
import { PlantProps } from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
    key: string;
    title: string;
}
export function PlantSelect(){
    const [environment, setEnvironment] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState<string>();
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation();

    async function fetchPlants(){
        const {data} = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoadingMore(true);

        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        }else{
            setPlants(data);
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    const handleEnvironmentSelected = function(environment: string){
        setEnvironmentSelected(environment);

        if(environment == 'all'){
            return setFilteredPlants(plants);
        }

        const filtered = plants.filter(plant => plant.environments.includes(environment));

        setFilteredPlants(filtered);
    }

    const handleFetchMore = function(distance: number){
        if(distance < 1) 
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue+1);
        fetchPlants();
    }

    const handlePlantSelect = function(plant: PlantProps){
        navigation.navigate('PlantSave', {plant});
      //  navigation.navigate('PlantSave' as never, {plant} as never);

    }

    useEffect(()=>{
        async function fetchEnvironment(){
            const {data} = await api.get('plants_environments?_sort=name=title&_order=asc');
            setEnvironment([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnvironment();
    }, []);

    useEffect(() =>{
        fetchPlants();
    }, []);

    if (loading)
        return <Load />

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={environment}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item})=>(
                        <EnvironmentButton 
                            title={item.title}
                            active={item.key === environmentSelected}
                            onPress={()=>handleEnvironmentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item})=>(
                        <PlantCardPrimary 
                            data={item} 
                            onPress={()=> handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1} // ao alcançar 10% do final
                    onEndReached={({distanceFromEnd})=> { // roda essa função
                        handleFetchMore(distanceFromEnd);
                    }}
                    ListFooterComponent={
                        loadingMore
                            ? <ActivityIndicator color={colors.green_dark} />
                            : <></>
                    }
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15,

    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingHorizontal: 32,
        marginVertical: 20
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
    },
})