<?php

namespace App;

trait TranslatableHelper
{
    use \Dimsav\Translatable\Translatable;

    /**
     * Overrides default dimsav save method
     * etrepat/baum collission.
     */
    public function save(array $options = [])
    {
        $tempTranslations = $this->translations;
        if ($this->exists) {
            if (count($this->getDirty()) > 0) {
                // If $this->exists and dirty, parent::save() has to return true. If not,
                // an error has occurred. Therefore we shouldn't save the translations.
                if (parent::save($options)) {
                    $this->setRelation('translations', $tempTranslations);

                    return $this->saveTranslations();
                }

                return false;
            } else {
                // If $this->exists and not dirty, parent::save() skips saving and returns
                // false. So we have to save the translations
                $this->setRelation('translations', $tempTranslations);

                return $this->saveTranslations();
            }
        } elseif (parent::save($options)) {
            // We save the translations only if the instance is saved in the database.
            $this->setRelation('translations', $tempTranslations);

            return $this->saveTranslations();
        }

        return false;
    }
}
