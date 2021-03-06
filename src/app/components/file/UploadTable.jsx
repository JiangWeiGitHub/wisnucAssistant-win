/**
 * @component uploadTable
 * @description uploadTable
 * @time 2016-11-8
 * @author liuhua
 **/
  'use strict';
// require core module
import React, { findDOMNode, Component, PropTypes } from 'react'
import FileFolder from 'material-ui/svg-icons/file/folder'
import EditorInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file'
// import Component 

class UploadTable extends Component {
	constructor() {
		super()
		this.state = {open:false}
	}
	render() {
		let item = this.props.item
		let classname = !!this.props.isRoot?'transimissionRoot':''
		return (
			<div className={classname}>
				<div className='transimissionRow' onClick={this.toggleChildren.bind(this)}>
					<span></span>
					<span>{item.name}</span>
					<span>{this.getSize()}</span>
					<span>{this.getProgress()}</span>
				</div>
				<div style={{paddingLeft:'30px'}}>
					{this.getChildren()}
				</div>
			</div>
		)
	}

	toggleChildren() {
		this.setState({
			open : !this.state.open
		})
	}

	getChildren() {
		let result
		if (!this.state.open || !this.props.item.children ) {
			return null
		}else {
			return this.props.item.children.map(item => {
				return <UploadTable key={item.target+item.abspath} item={item}/>
			})
		}
		return result
	}

	getSize() {
		let size = this.props.item.size
		if (!size) {
			return ''
		}
		size = parseFloat(size);
		if (size < 1024) {
			return size.toFixed(2)+' B'
		}else if (size < 1024*1024) {
			return (size/1024).toFixed(2)+' KB'
		}else if(size<1024*1024*1024) {
			return (size/1024/1024).toFixed(2)+ ' M'
		}else {
			return (size/1024/1024/1024).toFixed(2)+ ' G'
		}
	}

	getProgress() {
		let item = this.props.item
		if (item.type == 'file') {
			if (item.progress !== 0 && item.progress !== 1 && item.progress !== 1.01) {
				return (item.progress*100).toFixed(2)+' %'
			}else if (item.progress == 1.01 || item.message) {
				return '上传失败'
			}else {
				return this.getState(item.state)
			}
		}else {
			if (!item.isRoot) {
				return
			}
			if (item.finishCount == item.children.length) {
				return '已完成'
			}else {
				return '已上传 ' + item.success
			}
		}
	}

	getState(state) {
		if (state == 'ready' || state == 'hashless') {
			return '准备'
		}else if (state == 'running') {
			return '99.9%'
		}else if (state == 'hashing') {
			return '正在校验'
		}else if (state == 'finished') {
			return '已完成'
		}
		else {
			return state
		}
	}
}



export default UploadTable