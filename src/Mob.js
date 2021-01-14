import firestore from '@/firebase/firestore.js';
import firebase from "firebase";

import axios from "axios";

let docksRef = firestore.collection('decks');
let productsRef = firestore.collection('products');
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
        return urlStr.replace(/.*\//, "").replace(".html", "")
    },
    getBattleResult: function(answerData, productCodes) {
        var result = {
            isAllHit: false,
            hitAnswers: [],
            unhitAnswers: [],
        };
        productsRef.where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            productCodes
        ).get().then(
            function (querySnapshot) {
                querySnapshot.docs.forEach(doc => {
                    //TODO: CVとCircleNameをヒットチェック
                    console.log(doc.data())
                    var isCollect = false;
                    answerData.cv.forEach(function (cv) {
                        console.log(doc.data().CV)
                        if (doc.data().CV.includes(cv)){
                            isCollect = true;
                            result.hitAnswers.push(doc.data());
                            return;
                        }
                    })
                    if (isCollect){
                        return;
                    }
                    answerData.circle.forEach(function (circle) {
                        if (doc.data().CircleName == circle){
                            isCollect = true;
                            result.hitAnswers.push(doc.data());
                            return;
                        }                    
                    })
                    if (!isCollect){
                        result.unhitAnswers.push(doc.data());
                    }
        
                });
                //console.log(productCodes.length, result.hitAnswers.length);
                if (productCodes.length == result.hitAnswers.length){
                    result.isAllHit = true;
                }        
            }
        )

        return result
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
        productUrls.forEach(function(productUrl){
            let productCode = productUrl.replace(/.*\//, "").replace(".html", "")
            if (productsRef.doc(productCode).exists){
                //すでにある場合
            }else{
                //存在しない場合
                axios.post(
                    "https://n8n.iranika.info/webhook/dlsitesq",
                    {
                        "product":productUrl
                    }
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
