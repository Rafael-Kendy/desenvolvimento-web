function LabelField({name, label, field, type="text", size, value, onChange, required=false}){
    return(
        <label>

        {label}:
        {type==="area" ? (
            <textarea name={name} value={value} onChange={onChange} required={required} rows={size || 4}/>
        ):(
            <input name={name} type={type} value={type==="file" ? undefined:value} onChange={onChange} required={required} rows={size || 4}/>
        )}

        </label>
    )
}

export default LabelField