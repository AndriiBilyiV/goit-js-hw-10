import axios from "axios";
axios.defaults.headers.common["x-api-key"] = 'live_5pGmca6suTiVwozT21o70hIdZ4Z5c66jaZenNiRzr1E22kLxThs68Hlf2HqVbOCN';
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import './css/loader.css'

const loaderTag = `<span class="load"></span>`;
document.querySelector('body').insertAdjacentHTML('beforeend', loaderTag)

const loader = document.querySelector('.loader');
const load = document.querySelector('.load');
const selectBox = document.querySelector('.breed-select');
const thumb = document.querySelector('.cat-info');

loader.style.display = 'none';
selectBox.style.display = 'none';
selectBox.style.marginBottom = "40px";
thumb.style.display = 'none';

selectBox.setAttribute('id','single')


document.querySelector('.error').style.display = 'none';
const errorText = document.querySelector('.error').textContent;

let boxValues = '<option style="color: lightgray;" value="">Choose a cat breed</option>';
    
let breedsInfo;
fetchBreeds().then(data => {
        breedsInfo = data;
        data.forEach(breed => {
        boxValues += `<option value="${breed.id}">${breed.name}</option>`
        })
        selectBox.insertAdjacentHTML("afterbegin", boxValues);
        load.style.display = 'none';
        selectBox.style.display = 'block'
        new SlimSelect({
            select: '#single'
        });
         selectBox.style.overflow = 'scroll';
    })
    .catch(() => Notiflix.Notify.failure(errorText))

selectBox.addEventListener('change', () => {
    thumb.style.display = 'none';
    load.style.display = 'block';
    const currentBreed = selectBox.value;
    const breedInfo = breedsInfo.find(breed => breed.id === currentBreed);
    fetchCatByBreed(currentBreed)
        .then(data => {
            const markup = `<img class="image" src="${data[0].url}" alt="${breedInfo.name}" width = "400px" style="margin-right:32px">
            <div style="max-width:600px"><p>${breedInfo.description}</p>
            <p style="font-weight: 700">Temperament</p>
            <p>${breedInfo.temperament}</p></div>`            
            thumb.innerHTML = markup;
            const img = document.querySelector('.image');
            img.addEventListener('load', () => {
                thumb.style.display = 'flex'
                load.style.display = 'none';
            })
        })
        .catch( () => Notiflix.Notify.failure(errorText))
})