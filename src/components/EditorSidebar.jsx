import React, { useState } from 'react';
import { Upload, Plus, Video, Download, Trash2 } from 'lucide-react';

const EditorSidebar = ({ onVideoUpload, onAddLayer, layers, onDeleteLayer, onStartRecording, isRecording, currentTime }) => {
  // নতুন লেয়ারের জন্য লোকাল স্টেট
  const [newText, setNewText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(3);

  const handleAdd = () => {
    if (!newText) return;
    onAddLayer({
      text: newText,
      style: selectedStyle,
      startTime: parseFloat(startTime),
      endTime: parseFloat(startTime) + parseFloat(duration),
      fontSize: 40, color: '#ffffff', posX: 50, posY: 80 // ডিফল্ট পজিশন (Lower Third)
    });
    setNewText(''); // রিসেট
  };

  // বর্তমান ভিডিও টাইমকে স্টার্ট টাইম হিসেবে সেট করার হেল্পার
  const setStartToCurrent = () => setStartTime(currentTime.toFixed(1));

  return (
    <div className="sidebar">
      <h2 style={{display:'flex', alignItems:'center', gap:'10px'}}><Video size={24}/> EconMotion</h2>

      {/* 1. ভিডিও আপলোড */}
      <div className="control-group" style={{borderBottom: '1px solid #444', paddingBottom:'20px'}}>
        <label className="primary" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'10px', background:'#4a90e2', borderRadius:'6px', cursor:'pointer'}}>
          <Upload size={18}/> Import Video File
          <input type="file" accept="video/*" hidden onChange={onVideoUpload} />
        </label>
      </div>

      {/* 2. নতুন টেক্সট যুক্ত করা */}
      <div className="control-group">
        <h3>Add Text Layer</h3>
        <input type="text" placeholder="Enter text here..." value={newText} onChange={(e) => setNewText(e.target.value)} />
        
        <label>Style (For Economics)</label>
        <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
          <option value="normal">Normal Text</option>
          <option value="reveal">✨ Concept Reveal (Definitions)</option>
          <option value="highlight">🖊️ Focus Marker (Keywords)</option>
          <option value="glitch">⚡ Myth Buster Glitch</option>
        </select>

        <div style={{display:'flex', gap:'10px'}}>
          <div className="control-group" style={{flex:1}}>
             <label>Start Time (s) <button onClick={setStartToCurrent} style={{fontSize:'0.7rem', padding:'2px 5px'}}>Set Current</button></label>
             <input type="number" value={startTime} onChange={e => setStartTime(e.target.value)} step="0.1"/>
          </div>
          <div className="control-group" style={{flex:1}}>
             <label>Duration (s)</label>
             <input type="number" value={duration} onChange={e => setDuration(e.target.value)} step="0.5"/>
          </div>
        </div>

        <button className="primary" onClick={handleAdd} style={{display:'flex', justifyContent:'center', gap:'5px'}}>
          <Plus size={18}/> Add Layer
        </button>
      </div>

      {/* 3. লেয়ার তালিকা */}
      <div className="control-group" style={{flex: 1, overflowY:'auto'}}>
        <h3>Layers ({layers.length})</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
        {layers.map(layer => (
          <div key={layer.id} className="layer-item">
            <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60%'}}>
                {layer.style === 'normal' ? '' : (layer.style === 'reveal' ? '✨ ' : (layer.style === 'highlight' ? '🖊️ ' : '⚡ '))}
                {layer.text}
            </span>
            <span style={{fontSize:'0.8rem', color:'#aaa'}}>
                {layer.startTime}s - {layer.endTime}s
                <Trash2 size={14} style={{marginLeft:'10px', cursor:'pointer', color:'#e74c3c'}} onClick={()=>onDeleteLayer(layer.id)}/>
            </span>
          </div>
        ))}
        </div>
      </div>
        
      {/* 4. এক্সপোর্ট/রেকর্ড */}
      <div className="control-group">
        <button className={`primary record-btn ${isRecording ? 'recording' : ''}`} onClick={onStartRecording}>
          {isRecording ? '🔴 Recording... (Click to Stop)' : '🎥 Record Final Video'}
        </button>
        <p style={{fontSize:'0.7rem', color:'#aaa', marginTop:'5px'}}>*Select the "Chrome Tab" option and make sure "Share tab audio" is checked.</p>
      </div>
    </div>
  );
};

export default EditorSidebar;