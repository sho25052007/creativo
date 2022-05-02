import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getDocument = (collection, id) => {

  const document = ref(null)
  const error = ref(null)

  // register the firestore collection reference
  let documentRef = projectFirestore.collection(collection).doc(id)

  const unsub = documentRef.onSnapshot(doc => {
    if(doc.data()) { //checking if there is a doc which corresponds to the given id.
        document.value = {...doc.data(), id: doc.id} //updates doc and adds id too.
        error.value = null
    } else {
        error.value = 'That document does not exist.'
    }
  }, err => {
    console.error(err.message)
    error.value = 'could not fetch the document'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  }); //stop snapshot stacking by unsubscribing

  return { error, document }
}

export default getDocument