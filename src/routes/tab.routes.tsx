import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import colors from '../styles/colors';
import { PlantSelect } from '../pages/PlantSelect';
import { MaterialIcons } from '@expo/vector-icons';
import { MyPlants } from '../pages/MyPlants';

const AppTab = createBottomTabNavigator();

const AuthRoutes =() =>{
    return(
        <AppTap.Navigator
        tabBarOptions={{
            activeTintColor:colors.green,
            inactiveTinColor:colors.heading,
            labelPosition:'beside-icon',
            style:{
                paddingVerdical:20,
                height:88
            },
        }}>
            <AppTab.Screen
                name="Nova Plantas"
                component={PlantSelect}
                options={{
                    tabBarIcon:(({size,color})=(
                        <MaterialIcons
                            name="add-circle-outline"
                            size={size}
                            color={color}
                        />    
                    ))
                }}
            />
            <AppTab.Screen
                name="Minhas Plantas"
                component={MyPlants}
                options={{
                    tabBarIcon:(({size,color})=(
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />    
                    ))
                }}
            />
        </AppTap.Navigator>
    )
}

export default AuthRoutes;