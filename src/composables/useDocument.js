import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'

const useDocument = (collection, id) => {
    const error = ref(null)
    const isPending = ref(false)
    const isUpdating = ref(false)

    let docRef = projectFirestore.collection(collection).doc(id)

    const deleteDoc = async () => {
        isPending.value = true
        error.value = null
        try {
            const res = await docRef.delete()
            isPending.value = false
            return res
        } catch (err) {
            console.error(err.message)
            error.value = 'could not delete the document'
            isPending.value = false
        }
    }

    const updateDoc = async (updates) => {
        isUpdating.value = true
        error.value = null
        try {
            const res = await docRef.update(updates)
            isUpdating.value = false
            return res
        } catch (err) {
            console.error(err.message)
            error.value = 'could not update the document'
            isUpdating.value = false
        }
    }

    return { error, isPending, deleteDoc, isUpdating, updateDoc }
}

export default useDocument