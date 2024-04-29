import EventEmitter from "./EventEmitter";
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/Addons.js";
export default class Resources extends EventEmitter{

    constructor(sources){
        super();
        console.log("in resources");
        this.sources = sources;
       
        this.items = {};
        this.tolaod = this.sources.length;
        this.loaded = 0;

        this.setLoader();
        this.startLoading();
    }


    setLoader(){
        this.loader = {};
        this.loader.gltfloader = new GLTFLoader();
        this.loader.textureloader = new THREE.TextureLoader();
        this.loader.cubeTextureLoader = new THREE.CubeTextureLoader();
    }


    startLoading(){
        // Load each source
        for(const source of this.sources)
        {   
    
            if(source.type === 'gltfModel')
            {
                this.loader.gltfloader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loader.textureloader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loader.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }


    sourceLoaded(source,file){
        this.items[source.name]= file;
        this.loaded++;

        if(this.loaded===this.tolaod){
            console.log("are loaded");
            this.trigger("ready");
        }
        else{
            console.log("not loaded");
        }
    }
}