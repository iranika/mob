import firestore from '@/firebase/firestore.js';
import firebase from "firebase";

let docksRef = firestore.collection('decks');
let productsRef = firestore.collection('products');


export default {
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
    }
    
}
