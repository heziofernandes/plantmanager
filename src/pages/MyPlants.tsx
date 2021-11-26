import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Alert
} from 'react-native';

import { Header } from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import waterDrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants(){
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    const handleRemove = (plant: PlantProps) => {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async() => {
                    try {
                        await removePlant(plant.id);

                        setMyPlants((oldData) => {
                            return oldData.filter((item) => item.id != plant.id)
                        });
                    }catch (e) {
                        Alert.alert("Não foi possível remover!");
                    }
                }
            }
        ]);
    }

    useEffect(() =>{
        async function loadStorageData(){
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                {locale: pt}
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} daqui a ${nextTime}.`
            )

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStorageData();
    }, []);

    if (loading)
        return <Load />

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <Header />

                <View style={styles.spotlight}>
                    <Image source={waterDrop} />
                    <Text style={styles.spotlightText}>
                        {nextWatered}
                    </Text>
                </View>

                <View style={styles.plants}>
                    <Text style={styles.plantsTitle}>
                        Próximas regadas
                    </Text>

                    { 
                        myPlants.map((item) => {
                            return <PlantCardSecondary
                                key={item.id}
                                handleRemove={()=>(handleRemove(item))}
                                data={item}
                            />
                        })
                    }

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    header: {
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: colors.green_light,
        paddingHorizontal: 30,
    },
    spotlight: {
     backgroundColor: colors.blue_light,
     paddingHorizontal: 20,
     borderRadius: 20,
     height: 110,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
});