
import { createBDChar } from '../find'

export default function correctBiaodian() {
  return (
    this
    .addAvoid( 'h-char' )
    .replace(
      /([‘“])/g, portion => (
        createBDChar( portion.text )
        .addClass( 'bd-open punct western' )
      )
    )
    .replace(
      /([’”])/g, portion => (
        createBDChar( portion.text )
        .addClass( 'bd-close bd-end punct western' )
      )
    )
    .charify({ biaodian: true })
    .removeAvoid( 'h-char' )
  )
}

