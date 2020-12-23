package com.reactnativetwiliovideo.models

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.toPlainCollection(): Map<String, Any> {
  val result = mutableMapOf<String, Any>()
  entryIterator.forEach {
    val (key, value) = it
    result[key] = value.toPlainCollection()
  }
  return result
}

fun ReadableArray.toPlainCollection(): List<Any> {
  return toArrayList().map { it.toPlainCollection() }
}

fun Any.toPlainCollection(): Any {
  return when(this) {
    is ReadableMap -> this.toPlainCollection()
    is ReadableArray -> this.toPlainCollection()
    else -> this
  }
}
