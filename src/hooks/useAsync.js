import { useCallback, useEffect, useState } from "react"
import ErrorPopUp from "../components/Popups/Error.jsx"

/**
 * Hook personalizado para manejar operaciones asíncronas en React.
 * 
 * Este hook se encarga de ejecutar una función asíncrona, manejar los estados de carga, 
 * almacenar los datos obtenidos y capturar errores. Además, muestra un popup en caso de fallo.
 * 
 * @param {Function} callback - Función asíncrona que se ejecutará para obtener los datos.
 * @param {Array} deps - Lista de dependencias que determinan cuándo se debe volver a ejecutar la función.
 *                        Si está vacía, la función se ejecutará solo una vez al montar el componente.
 * @param {string} [errorMessage] - Mensaje de error personalizado para mostrar en el popup en caso de fallo.
 * 
 */
const useAsync = (callback, deps = [], errorMessage) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [error, setError] = useState(false)

    /**
     * Función que ejecuta el `callback` y maneja los estados de carga y error.
     * Se ejecuta automáticamente cuando cambian las dependencias definidas en `deps`.
     */
    const fetchData = useCallback(async () => {
        setError(false)
        setLoading(true)
        try {
            // Ejecuta la función asíncrona y obtiene los datos
            const data = await callback(...deps)
            // Si el resultado tiene la propiedad `objeto`, se extrae, si no, se usa el resultado tal cual
            const result = data?.objeto ? data.objeto : data
            
            const filtered = Array.isArray(result)
                ? result.filter(item =>
                    Object.values(item).some(
                        val => val !== null && val !== undefined && val !== 0
                    )
                )
                : result

            setData(filtered)
        } catch (error) {
            console.error("Error listando datos:", error)
            // Muestra un popup con el mensaje de error
            ErrorPopUp(errorMessage /*|| ErrorHandler(error).errorMessage*/)
            setData([])
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [...deps])

    /**
     * Efecto que ejecuta `fetchData` automáticamente cuando cambian las dependencias.
     * Evita la ejecución si alguna de las dependencias es `null` o una cadena vacía.
     */
    useEffect(() => {
        if (deps.length === 0 || (deps.length > 0 && !deps.includes(null) && !deps.includes("") && !deps.includes(undefined))) {
            fetchData()
        } else {
            setLoading(false)
        }
    }, [fetchData])

    return { loading, data, fetchData, error }
}

export default useAsync
