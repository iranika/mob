import firestore from '@/firebase/firestore.js';
import firebase from "firebase";

import axios from "axios";

let docksRef = firestore.collection('decks');
let productsRef = firestore.collection('products');
let productsPatchRef = firestore.collection('products_patch');
let usersRef = firestore.collection('users')
var decksPtr = [];

/*
function hasCheckProduct(productCodeArray) {
    //TODO: 編集が必要なフィールドがある場合にhasCheckのオブジェクト配列をreturnする
    //MEMO: 必要があればデータ編集をさせるフォームを表示させるためにhasCheckオブジェクト配列をコンポーネントに食わせる予定
    var result = [];
    productCodeArray.forEach(function (productCode) {
        if (productsRef.doc(productCode).exists){
            //プロダクトコードのドキュメントが存在する
            //TODO: プロダクトドキュメントのFieldが正しいかチェックを行う
        }else{
            //プロダクトコードのドキュメントが存在しない
            //TODO: プロダクトドキュメントの登録処理を行う
            axios.post(
                "http://n8n.iranika.info/webhook/dlsitesq",
                {
                    "product":productCode
                }
            ).then(function(res){
                console.log(res);
                //TODO: 戻り値のチェック
                console.log("Add Product Success: ", productCode);
            }).catch(function (err){
                console.err(err);
            });
            //TODO: プロダクトドキュメントのFieldが正しいかチェックを行う
        }
    })
    return result;
}
*/

export default {

    decks: decksPtr,
    getDecks: function () {
        let result = [];
        docksRef.get().then(
            function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    let d = doc.data();
                    d.deckid = doc.id
                    result.push(d);
                })
            }
        )
        //console.log(result)
        return result;
    },
    getProductCode: function(urlStr=""){
        return urlStr.replace(/.*\//, "").replace(/\.html.*$/, "")
    },
    getBattleResult: async function(answerData, productCodes) {
        var result = {
            isAllHit: false,
            hitAnswers: [],
            unhitAnswers: [],
        };

        const [productsSnap, patchSnap] = await Promise.all([
            productsRef.where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                productCodes
            ).get(),
            productsPatchRef.where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                productCodes
            ).get()
        ])

        const productData = productsSnap.docs.map(doc => doc.data())
        var patchData = {}
        patchSnap.docs.forEach(doc => { 
            patchData[doc.id] = doc.data() 
        })

        console.info("product", JSON.stringify(productData))
        console.info("patch", JSON.stringify(patchData))

        productData.forEach(function(doc){
            if (doc.Id in patchData){
                Object.keys(patchData[doc.Id]).forEach(function(key){
                    if(doc[key] == null){
                        doc[key] = patchData[doc.Id][key]
                    }else{
                        doc[key] = doc[key].concat(patchData[doc.Id][key])
                    }
                })
            }
            if (doc.CV == null){
                console.warn("product cv is null.", doc)
            }else if (answerData.cv.some(cv => doc.CV.includes(cv))){
                result.hitAnswers.push(doc)
                return
            }
            if (answerData.circle.some(circle => circle === doc.CircleName)){
                result.hitAnswers.push(doc)
            }else{
                result.unhitAnswers.push(doc);
            }
        })
        if (result.hitAnswers.length == productCodes.length){
            result.isAllHit = true
        }

        console.log("result", JSON.stringify(result))
        return result
        
    },
    setUserInfo: function(){
        //TODO: 認証済みか事前チェック
        if (firebase.auth().currentUser){
            const uid = firebase.auth().currentUser.uid
            usersRef.doc(uid).set({
                uid: uid,
                name: firebase.auth().currentUser.displayName,
                photo: firebase.auth().currentUser.photoURL
            }).then(function(docRef){
                console.log("Document was created.", docRef)
            }).catch(function (error) {
                console.error("Document was not created", error)               
            })

        }else{
            //current user is null
            console.warn("user was not login.", firebase.auth().currentUser())
        }
    },
    setDeck: function(title, auther, answers, answertype, hints){
        docksRef.add({
            title: title,
            auther: auther,
            answertype: answertype,
            answers: answers,
            hints: hints
        }).then(function(docRef){
            //TODO: プロダクトデータをチェックして、手動補正が必要なら
            console.log("Document written with ID: ", docRef.id);
        }).catch(function(error){
            console.error("Error adding document: ", error);
        });
    },
    addProductRequest: function(productUrls = []){
        let self = this
        productUrls.forEach(async function(productUrl){
            let productCode = self.getProductCode(productUrl)
            console.log("ProductCode", productCode)
            const snapshot = await productsRef.doc(productCode).get()

            if (snapshot.exists){
                //すでにある場合
                console.log("already exits", productCode)
            }else{
                //存在しない場合
                let params = new URLSearchParams()
                params.append("urls", productUrl)
                axios.post(
                    "http://yurika.iranika.info:1323/dlsitesq",
                    params
                ).then(function(res){
                    console.log(res);
                    //TODO: 戻り値のチェック
                    console.log("Add Product Success: ", productUrl);
                }).catch(function (err){
                    console.error(err);
                });
            }
        })
    }

}
