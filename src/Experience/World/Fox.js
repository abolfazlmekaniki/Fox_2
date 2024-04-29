import Experience from "../Experience";
import * as THREE from 'three'
import Time from "../Utils/Time";
import Debug from "../Utils/Debug";
export default class Fox{

    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = new Time();
        this.resource = this.resources.items.foxModel;
        this.debug = this.experience.debug

        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('fox')
            console.log(this.debugFolder);
        }

        this.setModel();
        this.setAnimation();
    }

    setModel(){
        this.model = this.resource.scene
        this.model.scale.set(0.02,0.02,0.02);
        this.scene.add(this.model);


        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation(){

        this.animation={};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.actions={}
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        this.animation.play= (name)=>{

            const newAction = this.animation.actions[name];
            const oldAcrtion = this.animation.actions.current;
            
            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAcrtion,1);

            this.animation.actions.current = newAction;
        }

        if(this.debug.active){
            const debugobject = {
                playIdle : ()=>{this.animation.play('idle')},
                playWalking : ()=>{this.animation.play('walking')},
                playRunning : ()=>{this.animation.play('running')}
            }

            this.debug.ui.add(debugobject,"playIdle");
            this.debug.ui.add(debugobject,"playWalking");
            this.debug.ui.add(debugobject,"playRunning");
        }
    }

    update(){
        this.animation.mixer.update(this.time.delta*0.001);
    }
}